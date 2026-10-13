void main() {
    char[] letters = IO.readln().toCharArray();
    for (int left = 0, right = letters.length - 1; left < right; left++, right--) {
        char saved = letters[left];
        letters[left] = letters[right];
        letters[right] = saved;
    }
    IO.println(new String(letters));
}
