FROM python:3.10-slim-buster

# Set the working directory
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt requirements.txt

# Upgrade pip to the latest version
RUN pip3 install --upgrade pip

# Install the dependencies from requirements.txt
RUN pip3 install -r requirements.txt

# Copy the entire project to the container
COPY . .

# Specify the command to run the Flask app
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
