boolean isPalindrome(String text) {
    if (text.length() <= 1) {
        return true;
    }
    if (text.charAt(0) != text.charAt(text.length() - 1)) {
        return false;
    }
    return isPalindrome(text.substring(1, text.length() - 1));
}

void main() {
    String line = IO.readln().trim();
    String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
    IO.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
}
