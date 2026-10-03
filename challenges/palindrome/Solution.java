void main() {
    String word = IO.readln().trim().toLowerCase();
    String reversed = "";
    for (int i = word.length() - 1; i >= 0; i--) {
        reversed += word.charAt(i);
    }
    IO.println(word.equals(reversed) ? "Palindrome" : "Not a palindrome");
}
