# syntax=docker/dockerfile:1

FROM tesseractshadow/tesseract4re

# Turn off debconf messages during build
ENV DEBIAN_FRONTEND noninteractive
ENV TERM linux

# Install system dependencies
# Docker says run apt-get update and install together,
# and then rm /var/lib/apt/lists to reduce image size.
RUN apt-get update && apt-get install -y \
    python3-pil \
    python3-requests \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip

# Add requirements.txt before rest of repo, for caching
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# ADD . /app
COPY ./flask_server /flask_server
WORKDIR /flask_server

# Remove Click runtime error: Python was configured to use ASCII as encoding for the environment
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

EXPOSE 8050

# Run app.py directly - this will run flask according to the parameters in app.run()
# defaults to 5000, unless the parameters have been changed as it has been here to 8050
CMD ["python3", "app.py"]

# Run flask on default port 5000
# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

# Run flask on a specified port instead
# CMD [ "python3", "-m" , "flask", "run", "--host" ,"0.0.0.0", "--port", "8050"]
