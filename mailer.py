from datetime import datetime
from email.message import EmailMessage
import csv
import random
import re
import smtplib
import time

# --- APNI DETAILS YAHAN DAALEIN ---
SENDER_EMAIL = ""
APP_PASSWORD = ""
# ---------------------------------

SUBJECT = ""
HTML_BODY = """
"""

MIN_DELAY = 60
MAX_DELAY = 75


def is_valid_email(email):
  regex = r"^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
  return re.match(regex, email)


def get_emails_from_csv(filename):
  email_list = []
  try:
    with open(filename, mode="r") as file:
      reader = csv.reader(file)
      for row in reader:
        if row and row[0].strip():
          email = row[0].strip()
          if is_valid_email(email):
            email_list.append(email)
          else:
            print(f"Skipped Invalid Email Format: {email}")
  except FileNotFoundError:
    print(f"Error: '{filename}' file nahi mili.")
  return email_list


def log_failed_email(email, error_msg):
  with open("failed_emails.txt", "a") as f:
    f.write(f"{email} - Error: {error_msg}\n")


def send_emails():
  emails = get_emails_from_csv("clients.csv")
  if not emails:
    print("Koi valid email nahi mili. Script stop ho rahi hai.")
    return

  print(
      f"Total {len(emails)} valid emails mili hain. Sending process start ho"
      " raha hai...\n"
  )

  try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
      smtp.login(SENDER_EMAIL, APP_PASSWORD)
      print("Login successful! Connection establish ho gaya.\n")

      for index, receiver_email in enumerate(emails, start=1):
        try:
          msg = EmailMessage()
          msg["Subject"] = SUBJECT
          msg["From"] = SENDER_EMAIL
          msg["To"] = receiver_email

          msg.set_content("Please enable HTML to view this email.")
          msg.add_alternative(HTML_BODY, subtype="html")

          smtp.send_message(msg)
          print(
              f"✅ [{index}/{len(emails)}] Successfully sent to: {receiver_email}"
          )

        except Exception as e:
          print(
              f"❌ [{index}/{len(emails)}] Failed to send to: {receiver_email}"
          )
          log_failed_email(receiver_email, str(e))

        if index < len(emails):
          delay = random.randint(MIN_DELAY, MAX_DELAY)
          print(f"⏳ Waiting for {delay} seconds (Anti-spam delay)...\n")
          time.sleep(delay)

    print("\n🎉 Mission Accomplished! Process complete ho gaya hai.")

  except Exception as e:
    print(f"Critical Error (Login ya Connection ka masla): {e}")


if __name__ == "__main__":
  open("failed_emails.txt", "w").close()
  send_emails()