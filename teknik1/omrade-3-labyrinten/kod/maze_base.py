# maze_base.py – basen till labyrinten (pass 9)
#
# Spara filen som main.py i er projektmapp. Allt här har ni skrivit förut,
# det har bara fått engelska namn:
#
#     forward(left, right)     er kor(v, h) från pass 7
#     stop()                   er stopp() från pass 5
#     turn_left(speed)         er vanster(fart) från pass 5
#     turn_right(speed)        er hoger(fart) från pass 5
#     follow_track(position)   linjeföljningen från pass 7
#
# Er kod skriver ni längst ner, under raden "ER KOD".
# TRSensor.py och ST7789.py ska ligga på Pico:n, precis som förut.

from machine import Pin, PWM
from time import sleep
from TRSensor import TRSensor
from ST7789 import ST7789


# ---------- Tal att ställa in på er robot ----------

DARK = 500          # sensorvärde över detta räknas som svart tejp (0-1000)
SPEED = 35          # fart rakt fram (0-100)
TURN_SPEED = 30     # fart när roboten svänger på stället (0-100)


# ---------- Motorerna (pass 5) ----------

left_speed = PWM(Pin(16))
left_speed.freq(1000)
left_forward = Pin(17, Pin.OUT)
left_backward = Pin(18, Pin.OUT)

right_speed = PWM(Pin(21))
right_speed.freq(1000)
right_forward = Pin(20, Pin.OUT)
right_backward = Pin(19, Pin.OUT)


def forward(left, right):
    """Kör framåt. En fart per hjul, 0-100."""
    left_forward.value(1)
    left_backward.value(0)
    right_forward.value(1)
    right_backward.value(0)
    left_speed.duty_u16(int(left * 65535 / 100))
    right_speed.duty_u16(int(right * 65535 / 100))


def stop():
    """Stanna båda hjulen."""
    left_speed.duty_u16(0)
    right_speed.duty_u16(0)


def turn_left(speed):
    """Sväng vänster på stället: vänster hjul bakåt, höger hjul framåt."""
    left_forward.value(0)
    left_backward.value(1)
    right_forward.value(1)
    right_backward.value(0)
    left_speed.duty_u16(int(speed * 65535 / 100))
    right_speed.duty_u16(int(speed * 65535 / 100))


def turn_right(speed):
    """Sväng höger på stället: vänster hjul framåt, höger hjul bakåt."""
    left_forward.value(1)
    left_backward.value(0)
    right_forward.value(0)
    right_backward.value(1)
    left_speed.duty_u16(int(speed * 65535 / 100))
    right_speed.duty_u16(int(speed * 65535 / 100))


# ---------- Linjeföljaren och skärmen (pass 7) ----------

sensor = TRSensor()
lcd = ST7789()


def show(text):
    """Skriv en rad på skärmen."""
    lcd.fill(lcd.SVART)
    lcd.text(text, 10, 10, lcd.VIT)
    lcd.show()


def follow_track(position):
    """Följ linjen. position kommer från sensor.readLine():
    0 = linjen långt till vänster, 2000 = mitt under, 4000 = långt till höger."""
    if position < 1500:
        forward(SPEED - 15, SPEED + 10)     # linjen är till vänster: styr vänster
    elif position > 2500:
        forward(SPEED + 10, SPEED - 15)     # linjen är till höger: styr höger
    else:
        forward(SPEED, SPEED)               # linjen är i mitten: rakt fram


# ---------- Kalibrering: vagga roboten över linjen ----------

show("Calibrating - rock!")
for i in range(100):
    sensor.calibrate()
show("Ready. Start in 3 s")
sleep(3)


# ---------- ER KOD ----------
# Just nu följer roboten bara linjen. Byt ut loopen mot er egen.

while True:
    position, values = sensor.readLine()
    follow_track(position)
