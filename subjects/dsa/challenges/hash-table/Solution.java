/** A hash table with separate chaining: each bucket is a linked list of nodes. */
class Table {
    private static class Node {
        final int key;
        int value;
        Node next;

        Node(int key, int value, Node next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    private Node[] buckets = new Node[16];
    private int size = 0;

    private static int index(int key, int length) {
        int h = key * 0x9E3779B1; // mixes the bits, so similar keys spread out
        return (h ^ (h >>> 16)) & (length - 1);
    }

    void put(int key, int value) {
        int i = index(key, buckets.length);
        for (Node n = buckets[i]; n != null; n = n.next) {
            if (n.key == key) {
                n.value = value;
                return;
            }
        }
        buckets[i] = new Node(key, value, buckets[i]);
        if (++size > buckets.length * 3 / 4) {
            grow();
        }
    }

    /** The value, or -1 when the key is missing (values are never negative). */
    int get(int key) {
        for (Node n = buckets[index(key, buckets.length)]; n != null; n = n.next) {
            if (n.key == key) {
                return n.value;
            }
        }
        return -1;
    }

    void remove(int key) {
        int i = index(key, buckets.length);
        Node previous = null;
        for (Node n = buckets[i]; n != null; previous = n, n = n.next) {
            if (n.key == key) {
                if (previous == null) {
                    buckets[i] = n.next;
                } else {
                    previous.next = n.next;
                }
                size--;
                return;
            }
        }
    }

    int size() {
        return size;
    }

    private void grow() {
        Node[] old = buckets;
        buckets = new Node[old.length * 2];
        for (Node head : old) {
            for (Node n = head; n != null; ) {
                Node next = n.next;
                int i = index(n.key, buckets.length);
                n.next = buckets[i];
                buckets[i] = n;
                n = next;
            }
        }
    }
}

void main() {
    int q = Integer.parseInt(IO.readln().trim());
    Table table = new Table();
    long found = 0;
    long missing = 0;
    long sum = 0;
    for (int i = 0; i < q; i++) {
        String[] parts = IO.readln().trim().split(" +");
        int op = Integer.parseInt(parts[0]);
        int key = Integer.parseInt(parts[1]);
        int value = Integer.parseInt(parts[2]);
        if (op == 1) {
            table.put(key, value);
        } else if (op == 2) {
            int v = table.get(key);
            if (v >= 0) {
                found++;
                sum += v;
            } else {
                missing++;
            }
        } else {
            table.remove(key);
        }
    }
    IO.println("found: " + found);
    IO.println("missing: " + missing);
    IO.println("sum: " + sum);
    IO.println("size: " + table.size());
}
