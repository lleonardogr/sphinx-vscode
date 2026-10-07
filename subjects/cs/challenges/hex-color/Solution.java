int digit(char c) {
    return "0123456789ABCDEF".indexOf(Character.toUpperCase(c));
}

void main() {
    String color = IO.readln().trim();
    if (!color.startsWith("#") || (color.length() != 4 && color.length() != 7)) {
        IO.println("Invalid color");
        return;
    }
    String hex = color.substring(1);
    if (hex.length() == 3) {
        hex = "" + hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
    int[] rgb = new int[3];
    for (int i = 0; i < 3; i++) {
        int high = digit(hex.charAt(2 * i));
        int low = digit(hex.charAt(2 * i + 1));
        if (high < 0 || low < 0) {
            IO.println("Invalid color");
            return;
        }
        rgb[i] = high * 16 + low;
    }
    int brightness = (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2] + 500) / 1000;
    IO.println("rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")");
    IO.println("Brightness: " + brightness);
    IO.println("Text: " + (brightness >= 128 ? "black" : "white"));
}
