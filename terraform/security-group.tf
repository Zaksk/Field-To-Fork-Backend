resource "aws_security_group" "field_sg" {
  name   = "field_sg"
  vpc_id = aws_default_vpc.default.id  
  tags = {
    name = "field_sg"
  }
}

resource "aws_security_group_rule" "ssh_ingres" {
    type = "ingress"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_group_id = aws_security_group.field_sg.id
}

resource "aws_security_group_rule" "app_port_1_ingress" {
  type              = "ingress"
  from_port         = 666
  to_port           = 666
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.field_sg.id
}

resource "aws_security_group_rule" "app_port_2_ingress" {
  type              = "ingress"
  from_port         = 667
  to_port           = 667
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.field_sg.id
}

resource "aws_security_group_rule" "egress" {
  type = "egress"
  from_port = 0
  to_port = 0
  protocol = -1
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.field_sg.id
}