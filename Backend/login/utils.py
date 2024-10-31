from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.core.cache import cache
import random


def send_email(to_email, subject, html_content):
    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        return str(e) 



def CodeGenerator(email):
    code = random.randint(100000, 999999)
    cache_key = f'verification_code_{email}' 
    cache.set(cache_key, code, timeout=300)
    print(f"Code : {code}")
    return code