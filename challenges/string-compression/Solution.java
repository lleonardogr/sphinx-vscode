void main() {
    String text = IO.readln().trim();
    StringBuilder compressed = new StringBuilder();
    int count = 1;
    for (int i = 1; i <= text.length(); i++) {
        if (i < text.length() && text.charAt(i) == text.charAt(i - 1)) {
            count++;
        } else {
            compressed.append(text.charAt(i - 1)).append(count);
            count = 1;
        }
    }
    IO.println(compressed.length() < text.length() ? compressed.toString() : text);
}
