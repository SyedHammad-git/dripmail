from datetime import datetime
from email.message import EmailMessage
import os
import random
import smtplib
import time
from typing import List
from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- Neon PostgreSQL Database Setup ---
# 1. DATABASE FIX: Ab koi hardcoded password nahi hai. Sirf environment variable use hoga!
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. "
        "Set it in Render's environment settings before starting the app."
    )

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CampaignLogDB(Base):
  __tablename__ = "campaign_logs"

  id = Column(Integer, primary_key=True, index=True)
  sender_email = Column(String)
  subject = Column(String)
  total_emails = Column(Integer)
  successful_count = Column(Integer)
  failed_count = Column(Integer)
  created_at = Column(DateTime, default=datetime.utcnow)


# Database tables automatically create hongi Neon par
Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI()

# 2. CORS FIX: Frontend URL ko dynamically allow karna
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global status dictionary
campaign_status = {
    "is_running": False,
    "is_paused": False,
    "total_emails": 0,
    "successful_emails": [],
    "failed_emails": [],
    "log": [],
}

# Control flag for pause/resume functionality
paused_flag = False


class CampaignData(BaseModel):
  sender_email: str
  app_password: str
  subject: str
  body_html: str
  client_list: List[str]
  min_delay: int
  max_delay: int


def send_emails_task(data: CampaignData):
  global campaign_status, paused_flag

  # Status initialize karna
  campaign_status.update({
      "is_running": True,
      "is_paused": False,
      "total_emails": len(data.client_list),
      "successful_emails": [],
      "failed_emails": [],
      "log": ["Campaign started successfully..."],
  })
  paused_flag = False

  try:
    campaign_status["log"].append("Connecting to SMTP server...")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
      smtp.login(data.sender_email, data.app_password)
      campaign_status["log"].append("SMTP Authentication successful.")

      for index, receiver_email in enumerate(data.client_list, start=1):
        # Pause handle karne ki loop
        while paused_flag:
          campaign_status["is_paused"] = True
          time.sleep(1)
          if not campaign_status["is_running"]:  # Agar cancel ho jaye
            break

        campaign_status["is_paused"] = False

        try:
          msg = EmailMessage()
          msg["Subject"] = data.subject
          msg["From"] = data.sender_email
          msg["To"] = receiver_email
          msg.set_content("Please enable HTML to view this email.")
          msg.add_alternative(data.body_html, subtype="html")

          smtp.send_message(msg)
          campaign_status["successful_emails"].append(receiver_email)
          campaign_status["log"].append(
              f"[{index}] Sent successfully to: {receiver_email}"
          )

        except Exception as e:
          campaign_status["failed_emails"].append(
              {"email": receiver_email, "error": str(e)}
          )
          campaign_status["log"].append(
              f"[{index}] Failed to {receiver_email}: {str(e)}"
          )

        # Aakhri email par delay ki zaroorat nahi
        if index < len(data.client_list):
          delay = random.randint(data.min_delay, data.max_delay)
          campaign_status["log"].append(f"Waiting {delay}s anti-spam delay...")

          # Delay ke doran bhi pause/resume check ho sake
          for _ in range(delay):
            while paused_flag:
              campaign_status["is_paused"] = True
              time.sleep(1)
            campaign_status["is_paused"] = False
            time.sleep(1)

  except Exception as e:
    campaign_status["log"].append(f"Critical Error: {str(e)}")

  finally:
    campaign_status["is_running"] = False
    campaign_status["is_paused"] = False
    campaign_status["log"].append("Campaign finished.")

    # Save summary to Neon PostgreSQL database automatically when campaign ends
    db = SessionLocal()
    try:
      db_log = CampaignLogDB(
          sender_email=data.sender_email,
          subject=data.subject,
          total_emails=len(data.client_list),
          successful_count=len(campaign_status["successful_emails"]),
          failed_count=len(campaign_status["failed_emails"]),
      )
      db.add(db_log)
      db.commit()
      campaign_status["log"].append(
          "Campaign summary saved to Neon PostgreSQL database."
      )
    except Exception as db_err:
      campaign_status["log"].append(f"Database Error: {str(db_err)}")
    finally:
      db.close()


# --- API Endpoints ---

@app.post("/start-campaign")
def start_campaign(data: CampaignData, background_tasks: BackgroundTasks):
  if campaign_status["is_running"]:
    return {"status": "error", "message": "A campaign is already running!"}

  background_tasks.add_task(send_emails_task, data)
  return {"status": "success", "message": "Campaign started successfully!"}


@app.post("/pause")
def pause_campaign():
  global paused_flag
  paused_flag = True
  campaign_status["is_paused"] = True
  campaign_status["log"].append("Campaign paused by user.")
  return {"status": "success", "message": "Campaign paused."}


@app.post("/resume")
def resume_campaign():
  global paused_flag
  paused_flag = False
  campaign_status["is_paused"] = False
  campaign_status["log"].append("Campaign resumed by user.")
  return {"status": "success", "message": "Campaign resumed."}


@app.get("/status")
def get_status():
  return campaign_status


@app.get("/history")
def get_history():
  db = SessionLocal()
  logs = db.query(CampaignLogDB).order_by(CampaignLogDB.created_at.desc()).all()
  db.close()
  return logs