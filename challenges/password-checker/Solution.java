void main() {
    String password = IO.readln();
    boolean hasUpper = false, hasLower = false, hasDigit = false;
    for (int i = 0; i < password.length(); i++) {
        char c = password.charAt(i);
        if (Character.isUpperCase(c)) hasUpper = true;
        if (Character.isLowerCase(c)) hasLower = true;
        if (Character.isDigit(c)) hasDigit = true;
    }
    boolean strong = true;
    if (password.length() < 8) { IO.println("Too short"); strong = false; }
    if (!hasUpper) { IO.println("Needs an uppercase letter"); strong = false; }
    if (!hasLower) { IO.println("Needs a lowercase letter"); strong = false; }
    if (!hasDigit) { IO.println("Needs a digit"); strong = false; }
    if (strong) IO.println("Strong password");
}
