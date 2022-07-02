FROM tesseractshadow/tesseract4re

## install dependencies
RUN apt-get update
RUN apt-get install -y liblog4cplus-dev
RUN apt-get install -y python python-pip

RUN ls
WORKDIR /
RUN ls
ADD requirements.txt /
RUN pip install -r requirements.txt

# pil error : decoder jpeg not available
RUN pip uninstall Pillow -y
RUN apt-get install -y libjpeg-dev
RUN pip install Pillow

# update working directories
ADD ./flask_server /flask_server
WORKDIR /flask_server

CMD ["python", "app.py"]