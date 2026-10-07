long little(int[] bytes, int start, int count) {
    long value = 0;
    for (int i = count - 1; i >= 0; i--) {
        value = value * 256 + bytes[start + i];
    }
    return value;
}

void main() {
    String[] hex = IO.readln().trim().split(" ");
    int[] bytes = new int[hex.length];
    for (int i = 0; i < hex.length; i++) {
        bytes[i] = Integer.parseInt(hex[i], 16);
    }
    if (bytes[0] != 'B' || bytes[1] != 'M') {
        IO.println("Not a BMP file");
        return;
    }
    IO.println("Format: BMP");
    IO.println("Width: " + little(bytes, 18, 4));
    IO.println("Height: " + little(bytes, 22, 4));
    IO.println("Bits per pixel: " + little(bytes, 28, 2));
    IO.println("File size: " + little(bytes, 2, 4) + " bytes");
}
