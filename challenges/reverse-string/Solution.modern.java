void main() {
    String text = IO.readln();
    String reversed = "";
    for (int i = text.length() - 1; i >= 0; i--) {
        reversed += text.charAt(i);
    }
    IO.println(reversed);
}
