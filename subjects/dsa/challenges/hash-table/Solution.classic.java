import java.util.*;

public class Main {

    // Open addressing with linear probing: a key goes to its slot, or the next free one.
    // Removed keys leave a tombstone, so later keys in the same run can still be found.
    static final byte EMPTY = 0, USED = 1, REMOVED = 2;
    static int[] keys = new int[16];
    static int[] values = new int[16];
    static byte[] state = new byte[16];
    static int size = 0, occupied = 0;

    static int slot(int key, int capacity) {
        long h = (key * 2654435761L) & 0xffffffffL;
        return (int) (h % capacity);
    }

    // The slot holding key, or -1.
    static int find(int key) {
        int i = slot(key, keys.length);
        while (state[i] != EMPTY) {
            if (state[i] == USED && keys[i] == key) {
                return i;
            }
            i = (i + 1) % keys.length;
        }
        return -1;
    }

    static void put(int key, int value) {
        int at = find(key);
        if (at >= 0) {
            values[at] = value;
            return;
        }
        if ((occupied + 1) * 2 > keys.length) {
            rebuild(keys.length * 2);
        }
        int i = slot(key, keys.length);
        while (state[i] == USED) {
            i = (i + 1) % keys.length;
        }
        if (state[i] == EMPTY) {
            occupied++;
        }
        keys[i] = key;
        values[i] = value;
        state[i] = USED;
        size++;
    }

    static void remove(int key) {
        int at = find(key);
        if (at >= 0) {
            state[at] = REMOVED;
            size--;
        }
    }

    static void rebuild(int capacity) {
        int[] oldKeys = keys, oldValues = values;
        byte[] oldState = state;
        keys = new int[capacity];
        values = new int[capacity];
        state = new byte[capacity];
        size = 0;
        occupied = 0;
        for (int i = 0; i < oldKeys.length; i++) {
            if (oldState[i] == USED) {
                put(oldKeys[i], oldValues[i]);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int q = scanner.nextInt();
        long found = 0, missing = 0, sum = 0;
        for (int i = 0; i < q; i++) {
            int op = scanner.nextInt();
            int key = scanner.nextInt();
            int value = scanner.nextInt();
            if (op == 1) {
                put(key, value);
            } else if (op == 2) {
                int at = find(key);
                if (at >= 0) {
                    found++;
                    sum += values[at];
                } else {
                    missing++;
                }
            } else {
                remove(key);
            }
        }
        System.out.println("found: " + found);
        System.out.println("missing: " + missing);
        System.out.println("sum: " + sum);
        System.out.println("size: " + size);
    }
}
