int count(String text, char letter) {
    int n = 0;
    for (int i = 0; i < text.length(); i++) {
        if (text.charAt(i) == letter) n++;
    }
    return n;
}

void main() {
    String first = IO.readln().toLowerCase().replace(" ", "");
    String second = IO.readln().toLowerCase().replace(" ", "");
    boolean same = first.length() == second.length();
    for (char c = 'a'; c <= 'z' && same; c++) {
        same = count(first, c) == count(second, c);
    }
    IO.println(same ? "Anagrams" : "Not anagrams");
}
