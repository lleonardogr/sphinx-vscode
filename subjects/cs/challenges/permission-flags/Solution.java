String letters(String digits) {
    StringBuilder out = new StringBuilder();
    for (char c : digits.toCharArray()) {
        if (c < '0' || c > '7') {
            return "Invalid";
        }
        int d = c - '0';
        out.append((d & 4) != 0 ? 'r' : '-').append((d & 2) != 0 ? 'w' : '-').append((d & 1) != 0 ? 'x' : '-');
    }
    return out.toString();
}

String digits(String letters) {
    StringBuilder out = new StringBuilder();
    for (int group = 0; group < 3; group++) {
        int d = 0;
        for (int i = 0; i < 3; i++) {
            char c = letters.charAt(group * 3 + i);
            if (c == "rwx".charAt(i)) {
                d |= 4 >> i;
            } else if (c != '-') {
                return "Invalid";
            }
        }
        out.append(d);
    }
    return out.toString();
}

void main() {
    String perms = IO.readln().trim();
    if (perms.length() == 3) {
        IO.println(letters(perms));
    } else if (perms.length() == 9) {
        IO.println(digits(perms));
    } else {
        IO.println("Invalid");
    }
}
