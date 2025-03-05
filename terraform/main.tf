terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
    region = "eu-west-2"
}

resource "aws_instance" "http_server" {
  ami = "ami-00710ab5544b60cf7"
  key_name = "eu-west"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.field_sg.id]
  subnet_id = data.aws_subnets.default_subnets.ids[0]
  connection {
    type = "ssh"
    host = self.public_ip
    user = "ec2-user"
    private_key = file(var.aws_key_pair)
  }
}

variable "aws_key_pair" {
    default = "~/aws/aws_keys/eu-west.pem"  
}