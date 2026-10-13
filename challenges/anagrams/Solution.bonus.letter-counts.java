void main() {
    String first = IO.readln().toLowerCase().replace(" ", "");
    String second = IO.readln().toLowerCase().replace(" ", "");
    int[] counts = new int[26];
    for (char c : first.toCharArray()) {
        counts[c - 'a']++;
    }
    for (char c : second.toCharArray()) {
        counts[c - 'a']--;
    }
    boolean same = true;
    for (int count : counts) {
        if (count != 0) same = false;
    }
    IO.println(same ? "Anagrams" : "Not anagrams");
}
