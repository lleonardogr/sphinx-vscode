boolean isPalindrome(String text) {
    return isPalindrome(text, 0, text.length() - 1);
}

boolean isPalindrome(String text, int left, int right) {
    if (left >= right) {
        return true;
    }
    if (text.charAt(left) != text.charAt(right)) {
        return false;
    }
    return isPalindrome(text, left + 1, right - 1);
}

void main() {
    String line = IO.readln().trim();
    String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
    IO.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
}
