# TRSensor.py – linjeföljaren på Pico2Go
#
# Bibliotek. Du behöver inte förstå allt här inne – du använder det.
# Ladda upp filen till Pico:n, skriv sedan i ditt eget program:
#
#     from TRSensor import TRSensor
#     sensor = TRSensor()
#     varden = sensor.AnalogRead()          # fem tal, 0–1023. Högre = mörkare
#     sensor.calibrate()                    # kör 100 gånger medan roboten vaggas över linjen
#     position, varden = sensor.readLine()  # position 0–4000, 2000 = linjen i mitten
#
# De fem sensorerna sitter på ett eget kort under fronten och läses via en extern
# AD-omvandlare (TLC1543). Kommunikationen sköts av en PIO-statemaskin i RP2350 –
# det är den delen som är svår, och den är färdigskriven.
#
# Bygger på Waveshares TRSensor.py. Gränssnittet är oförändrat, kommentarerna är
# på svenska. Kalibreringen fungerar som i Waveshares original.

from machine import Pin
import time
import rp2


# PIO-program: skickar ut en kanaladress bit för bit och läser in svaret. Rör inte.
@rp2.asm_pio(out_shiftdir=0, autopull=True, pull_thresh=12, autopush=True, push_thresh=12,
             sideset_init=(rp2.PIO.OUT_LOW), out_init=rp2.PIO.OUT_LOW)
def spi_cpha0():
    out(pins, 1)             .side(0x0)   [1]
    in_(pins, 1)             .side(0x1)   [1]


class TRSensor:
    """Fem IR-sensorer i rad. Index 0 är längst till vänster, 4 längst till höger."""

    def __init__(self):
        self.numSensors = 5
        self.calibratedMin = [0] * self.numSensors
        self.calibratedMax = [1023] * self.numSensors
        self.last_value = 0
        # Pinnar till AD-omvandlaren
        self.Clock = 6
        self.Address = 7
        self.DataOut = 27
        self.CS = Pin(28, Pin.OUT)
        self.CS.value(1)
        self.sm = rp2.StateMachine(1, spi_cpha0, freq=4 * 200000,
                                   sideset_base=Pin(self.Clock, Pin.OUT),
                                   out_base=Pin(self.Address, Pin.OUT),
                                   in_base=Pin(self.DataOut, Pin.IN))
        self.sm.active(1)

    def AnalogRead(self):
        """Läser alla fem sensorerna. Ger en lista med fem tal, 0–1023.
        Högre tal = mindre reflekterat ljus = mörkare underlag (svart tejp)."""
        value = [0] * (self.numSensors + 1)
        for j in range(0, self.numSensors + 1):
            self.CS.value(0)
            self.sm.put(j << 28)            # välj kanal
            value[j] = self.sm.get() & 0xfff  # hämta förra kanalens värde
            self.CS.value(1)
            value[j] >>= 2
        time.sleep_ms(2)
        return value[1:]

    def calibrate(self):
        """Läser sensorerna tio gånger och sparar lägsta och högsta värde per sensor.
        Anropa i en loop (t.ex. 100 gånger) medan roboten vaggas fram och tillbaka
        över linjen, så att varje sensor hinner se både vitt och svart."""
        max_sensor_values = [0] * self.numSensors
        min_sensor_values = [0] * self.numSensors
        for j in range(0, 10):
            sensor_values = self.AnalogRead()
            for i in range(0, self.numSensors):
                if (j == 0) or max_sensor_values[i] < sensor_values[i]:
                    max_sensor_values[i] = sensor_values[i]
                if (j == 0) or min_sensor_values[i] > sensor_values[i]:
                    min_sensor_values[i] = sensor_values[i]
        for i in range(0, self.numSensors):
            if min_sensor_values[i] > self.calibratedMin[i]:
                self.calibratedMin[i] = min_sensor_values[i]
            if max_sensor_values[i] < self.calibratedMax[i]:
                self.calibratedMax[i] = max_sensor_values[i]

    def readCalibrated(self):
        """Som AnalogRead, men varje värde skalas till 0–1000 utifrån kalibreringen.
        0 = det ljusaste sensorn såg under kalibreringen, 1000 = det mörkaste."""
        value = 0
        sensor_values = self.AnalogRead()
        for i in range(0, self.numSensors):
            denominator = self.calibratedMax[i] - self.calibratedMin[i]
            if denominator != 0:
                value = (sensor_values[i] - self.calibratedMin[i]) * 1000 / denominator
            if value < 0:
                value = 0
            elif value > 1000:
                value = 1000
            sensor_values[i] = int(value)
        return sensor_values

    def readLine(self):
        """Ger (position, varden).

        position är ett tal 0–4000 som säger var linjen är under roboten:
          0    = rakt under sensor 0 (vänster kant)
          2000 = rakt under sensor 2 (mitten)
          4000 = rakt under sensor 4 (höger kant)
        Det är ett viktat medelvärde av sensorernas index. Om ingen sensor ser
        linjen ges 0 eller 4000 beroende på vilken sida den senast var på.

        varden är listan från readCalibrated (0–1000 per sensor). Summan av den
        säger hur mycket svart roboten ser totalt: alla fem över tejp ger nära 5000."""
        sensor_values = self.readCalibrated()
        avg = 0
        sum = 0
        on_line = 0
        for i in range(0, self.numSensors):
            value = sensor_values[i]
            if value > 200:
                on_line = 1
            if value > 50:
                avg += value * (i * 1000)
                sum += value
        if on_line != 1:
            if self.last_value < (self.numSensors - 1) * 1000 / 2:
                self.last_value = 0
            else:
                self.last_value = (self.numSensors - 1) * 1000
        else:
            self.last_value = avg / sum
        return int(self.last_value), sensor_values


if __name__ == '__main__':
    # Testprogram: skriver ut råvärdena. Kör filen direkt för att se att sensorn lever.
    sensor = TRSensor()
    while True:
        print(sensor.AnalogRead())
        time.sleep(0.1)
