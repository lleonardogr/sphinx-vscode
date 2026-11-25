class Node {
    final int key;
    Node left;
    Node right;

    Node(int key) {
        this.key = key;
    }
}

Node insert(Node node, int key) {
    if (node == null) {
        return new Node(key);
    }
    if (key < node.key) {
        node.left = insert(node.left, key);
    } else {
        node.right = insert(node.right, key);
    }
    return node;
}

void inOrder(Node n, StringJoiner out) {
    if (n != null) {
        inOrder(n.left, out);
        out.add(String.valueOf(n.key));
        inOrder(n.right, out);
    }
}

void preOrder(Node n, StringJoiner out) {
    if (n != null) {
        out.add(String.valueOf(n.key));
        preOrder(n.left, out);
        preOrder(n.right, out);
    }
}

void postOrder(Node n, StringJoiner out) {
    if (n != null) {
        postOrder(n.left, out);
        postOrder(n.right, out);
        out.add(String.valueOf(n.key));
    }
}

int height(Node n) {
    return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));
}

int leaves(Node n) {
    if (n == null) {
        return 0;
    }
    return n.left == null && n.right == null ? 1 : leaves(n.left) + leaves(n.right);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    Node root = null;
    for (int i = 0; i < n; i++) {
        root = insert(root, Integer.parseInt(parts[i]));
    }
    StringJoiner in = new StringJoiner(" ");
    StringJoiner pre = new StringJoiner(" ");
    StringJoiner post = new StringJoiner(" ");
    inOrder(root, in);
    preOrder(root, pre);
    postOrder(root, post);
    IO.println("in-order: " + in);
    IO.println("pre-order: " + pre);
    IO.println("post-order: " + post);
    IO.println("height: " + height(root));
    IO.println("leaves: " + leaves(root));
}
