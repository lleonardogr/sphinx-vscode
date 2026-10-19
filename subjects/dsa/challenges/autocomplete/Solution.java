class TrieNode {
    final TrieNode[] next = new TrieNode[26];
    int words = 0; // how many words pass through this node
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    TrieNode root = new TrieNode();
    for (int i = 0; i < n; i++) {
        TrieNode node = root;
        for (char c : IO.readln().trim().toCharArray()) {
            if (node.next[c - 'a'] == null) {
                node.next[c - 'a'] = new TrieNode();
            }
            node = node.next[c - 'a'];
            node.words++;
        }
    }
    int q = Integer.parseInt(IO.readln().trim());
    StringBuilder out = new StringBuilder();
    for (int i = 0; i < q; i++) {
        TrieNode node = root;
        for (char c : IO.readln().trim().toCharArray()) {
            node = node.next[c - 'a'];
            if (node == null) {
                break;
            }
        }
        out.append(node == null ? 0 : node.words).append('\n');
    }
    IO.print(out);
}
