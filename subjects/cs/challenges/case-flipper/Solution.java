void main() {
    String text = IO.readln();
    StringBuilder out = new StringBuilder();
    for (char c : text.toCharArray()) {
        if (c >= 'A' && c <= 'Z') {
            out.append((char) (c + 32));
        } else if (c >= 'a' && c <= 'z') {
            out.append((char) (c - 32));
        } else {
            out.append(c);
        }
    }
    IO.println(out);
}
