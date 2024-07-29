# Use a slim Python base image
FROM python:3.9-slim-buster

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ .

# Environment variables
# ENV PYTHONUNBUFFERED 1
# ENV ALPHA_VANTAGE_API_KEY  # Replace with your API key (don't store it in the Dockerfile)
# ENV GOOGLE_API_KEY  # Replace with your Google API key
# ENV MAIL_USERNAME  # Replace with your email username
# ENV MAIL_PASSWORD  # Replace with your email password
# ENV MAIL_FROM  # Replace with your email address
# ENV MAIL_PORT  # Replace with your email port (default is 587)
# ENV MAIL_SERVER  # Replace with your email server address (e.g., smtp.gmail.com)
# ENV MAIL_STARTTLS  # Set to True if using STARTTLS
# ENV MAIL_SSL_TLS  # Set to False if using STARTTLS
# ENV DEPLOYMENT  # Set to "PROD" for production (disables reload)

# Expose port for FastAPI application
EXPOSE 5000

# Command to run the application 
CMD [ "python", "main.py" ]
