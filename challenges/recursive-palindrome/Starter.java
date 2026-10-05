// TODO: return true if text reads the same backwards, recursively
boolean isPalindrome(String text) {
    return false;
}

void main() {
    String line = IO.readln().trim();
    String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
    IO.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
}
