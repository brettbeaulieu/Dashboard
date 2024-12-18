# Use a Python image as the base
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Install the dependencies for both the Django project and the microservice
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . /app/

# Set the command to run the microservice
CMD ["python", "microservice.py"]