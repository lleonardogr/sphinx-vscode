String key(String word) {
    char[] count = new char[26];
    for (char c : word.toCharArray()) {
        count[c - 'a']++;
    }
    return new String(count);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    Map<String, Integer> counts = new HashMap<>();
    for (int i = 0; i < n; i++) {
        counts.merge(key(IO.readln().trim()), 1, Integer::sum);
    }
    int largest = 0;
    int alone = 0;
    for (int size : counts.values()) {
        largest = Math.max(largest, size);
        if (size == 1) {
            alone++;
        }
    }
    IO.println("groups: " + counts.size());
    IO.println("largest group: " + largest);
    IO.println("alone: " + alone);
}
