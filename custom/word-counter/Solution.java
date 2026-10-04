void main() {
    String text = IO.readln().trim();
    IO.println(text.isEmpty() ? 0 : text.split("\\s+").length);
}
