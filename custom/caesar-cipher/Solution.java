char shiftLetter(char c, int shift) {
    if (Character.isUpperCase(c)) {
        return (char) ('A' + (c - 'A' + shift) % 26);
    }
    if (Character.isLowerCase(c)) {
        return (char) ('a' + (c - 'a' + shift) % 26);
    }
    return c;
}

void main() {
    int shift = Integer.parseInt(IO.readln().trim());
    String message = IO.readln();
    StringBuilder encoded = new StringBuilder();
    for (char c : message.toCharArray()) {
        encoded.append(shiftLetter(c, shift));
    }
    IO.println(encoded);
}
