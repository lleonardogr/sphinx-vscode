void main() {
    String text = IO.readln().toLowerCase();
    int left = 0, right = text.length() - 1;
    boolean palindrome = true;
    while (left < right) {
        if (!Character.isLetterOrDigit(text.charAt(left))) {
            left++;
        } else if (!Character.isLetterOrDigit(text.charAt(right))) {
            right--;
        } else if (text.charAt(left) != text.charAt(right)) {
            palindrome = false;
            break;
        } else {
            left++;
            right--;
        }
    }
    IO.println(palindrome ? "Palindrome" : "Not a palindrome");
}
