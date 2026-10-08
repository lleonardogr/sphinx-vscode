void main() {
    String text = IO.readln();
    String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    StringBuilder encoded = new StringBuilder();
    for (int i = 0; i < text.length(); i += 3) {
        int left = Math.min(3, text.length() - i);
        int bits = 0;
        for (int k = 0; k < 3; k++) {
            bits = bits << 8 | (k < left ? text.charAt(i + k) : 0);
        }
        for (int g = 0; g < 4; g++) {
            encoded.append(g <= left ? alphabet.charAt((bits >> (18 - 6 * g)) & 63) : '=');
        }
    }
    IO.println(encoded);
}
