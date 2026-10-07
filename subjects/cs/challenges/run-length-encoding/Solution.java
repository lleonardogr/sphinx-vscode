String encode(String text) {
    StringBuilder out = new StringBuilder();
    int i = 0;
    while (i < text.length()) {
        int j = i;
        while (j < text.length() && text.charAt(j) == text.charAt(i)) {
            j++;
        }
        out.append(j - i).append(text.charAt(i));
        i = j;
    }
    return out.toString();
}

/** The decoded text, or null for an invalid code. */
String decode(String code) {
    StringBuilder out = new StringBuilder();
    int count = 0;
    boolean digits = false;
    for (char c : code.toCharArray()) {
        if (Character.isDigit(c)) {
            count = count * 10 + (c - '0');
            digits = true;
        } else {
            if (!digits || count == 0) {
                return null;
            }
            out.append(String.valueOf(c).repeat(count));
            count = 0;
            digits = false;
        }
    }
    return digits ? null : out.toString();
}

void main() {
    String mode = IO.readln().trim();
    String text = IO.readln().trim();
    String result = mode.equals("encode") ? encode(text) : decode(text);
    if (result == null) {
        IO.println("Invalid code");
        return;
    }
    IO.println(result);
    IO.println("Length: " + text.length() + " -> " + result.length());
}
