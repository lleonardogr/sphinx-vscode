void main() {
    String text = IO.readln();
    StringBuilder out = new StringBuilder();
    for (int i = 0; i < text.length(); i++) {
        if (i > 0) {
            out.append(' ');
        }
        out.append((int) text.charAt(i));
    }
    IO.println(out);
}
