// TODO: devolva true se o texto for igual de trás para frente, de forma recursiva
boolean isPalindrome(String text) {
    return false;
}

void main() {
    String line = IO.readln().trim();
    String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
    IO.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
}
