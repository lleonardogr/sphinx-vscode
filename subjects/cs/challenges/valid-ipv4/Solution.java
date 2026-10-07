boolean validPart(String part) {
    if (part.isEmpty() || part.length() > 3 || (part.length() > 1 && part.charAt(0) == '0')) {
        return false;
    }
    for (char c : part.toCharArray()) {
        if (!Character.isDigit(c)) {
            return false;
        }
    }
    return Integer.parseInt(part) <= 255;
}

void main() {
    String[] parts = IO.readln().trim().split("\\.", -1);
    boolean valid = parts.length == 4;
    for (String part : parts) {
        valid = valid && validPart(part);
    }
    IO.println(valid ? "Valid" : "Invalid");
}
