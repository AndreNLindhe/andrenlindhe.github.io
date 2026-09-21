# ST7789.py – skärmen på Pico2Go (1,14 tum, 240 × 135 pixlar)
#
# Bibliotek. Ladda upp filen till Pico:n, skriv sedan i ditt eget program:
#
#     from ST7789 import ST7789
#     lcd = ST7789()
#     lcd.fill(lcd.SVART)                    # rensa skärmen
#     lcd.text("hej", 10, 10, lcd.VIT)       # text, x, y, färg. Texten är 8 pixlar hög
#     lcd.show()                             # inget syns förrän show() körs
#
# Skärmen ritas i minnet först (en framebuffer) och skickas till displayen med show().
# Det gör att du kan rita flera saker och visa allt på en gång. Utöver text finns
# fill_rect(x, y, bredd, hojd, farg), line(x1, y1, x2, y2, farg) och pixel(x, y, farg)
# – de kommer från MicroPythons framebuf.
#
# Bygger på Waveshares ST7789.py. Gränssnittet är oförändrat, kommentarerna är på
# svenska. Färgkoderna är Waveshares – de ser konstiga ut (GREEN = 0x001F) eftersom
# byteordningen i bufferten inte är standard-RGB565, men de ger rätt färg på skärmen.

from machine import Pin, SPI
import framebuf


class ST7789(framebuf.FrameBuffer):
    def __init__(self):
        self.width = 240
        self.height = 135

        self.rst = Pin(12, Pin.OUT)
        self.bl = Pin(13, Pin.OUT)      # bakgrundsbelysning
        self.bl(1)

        self.cs = Pin(9, Pin.OUT)
        self.cs(1)
        self.spi = SPI(1, 10000_000, polarity=0, phase=0, sck=Pin(10), mosi=Pin(11), miso=None)
        self.dc = Pin(8, Pin.OUT)
        self.dc(1)
        self.buffer = bytearray(self.height * self.width * 2)
        super().__init__(self.buffer, self.width, self.height, framebuf.RGB565)
        self.init_display()

        # Färger. Både Waveshares engelska namn och svenska.
        self.WHITE = 0xFFFF
        self.BLACK = 0x0000
        self.GREEN = 0x001F
        self.RED = 0xF800
        self.BLUE = 0xFF00
        self.GBLUE = 0x07FF
        self.YELLOW = 0xFFE0
        self.VIT = self.WHITE
        self.SVART = self.BLACK
        self.GRON = self.GREEN
        self.ROD = self.RED
        self.BLA = self.BLUE
        self.GUL = self.YELLOW

    def write_cmd(self, cmd):
        self.cs(1)
        self.dc(0)
        self.cs(0)
        self.spi.write(bytearray([cmd]))
        self.cs(1)

    def write_data(self, buf):
        self.cs(1)
        self.dc(1)
        self.cs(0)
        self.spi.write(bytearray([buf]))
        self.cs(1)

    def init_display(self):
        """Startsekvensen för displaykretsen. Kommandon och värden från Waveshare – rör inte."""
        self.rst(1)
        self.rst(0)
        self.rst(1)
        sekvens = [
            (0x36, [0x70]),
            (0x3A, [0x05]),
            (0xB2, [0x0C, 0x0C, 0x00, 0x33, 0x33]),
            (0xB7, [0x35]),
            (0xBB, [0x19]),
            (0xC0, [0x2C]),
            (0xC2, [0x01]),
            (0xC3, [0x12]),
            (0xC4, [0x20]),
            (0xC6, [0x0F]),
            (0xD0, [0xA4, 0xA1]),
            (0xE0, [0xD0, 0x04, 0x0D, 0x11, 0x13, 0x2B, 0x3F, 0x54, 0x4C, 0x18, 0x0D, 0x0B, 0x1F, 0x23]),
            (0xE1, [0xD0, 0x04, 0x0C, 0x11, 0x13, 0x2C, 0x3F, 0x44, 0x51, 0x2F, 0x1F, 0x1F, 0x20, 0x23]),
            (0x21, []),
            (0x11, []),
            (0x29, []),
        ]
        for cmd, data in sekvens:
            self.write_cmd(cmd)
            for d in data:
                self.write_data(d)

    def show(self):
        """Skickar bufferten till skärmen. Inget du ritat syns förrän den här körs."""
        self.write_cmd(0x2A)
        self.write_data(0x00)
        self.write_data(0x28)
        self.write_data(0x01)
        self.write_data(0x17)

        self.write_cmd(0x2B)
        self.write_data(0x00)
        self.write_data(0x35)
        self.write_data(0x00)
        self.write_data(0xBB)

        self.write_cmd(0x2C)

        self.cs(1)
        self.dc(1)
        self.cs(0)
        self.spi.write(self.buffer)
        self.cs(1)


if __name__ == '__main__':
    # Testprogram: kör filen direkt för att se att skärmen lever.
    lcd = ST7789()
    lcd.fill(lcd.SVART)
    lcd.text("Teknik 1", 10, 10, lcd.VIT)
    lcd.text("Pico2Go", 10, 25, lcd.GRON)
    lcd.show()
