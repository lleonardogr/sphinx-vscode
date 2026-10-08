// Each bit of the position is the XOR of the Gray bits from the left up to it.
int position(String gray) {
    int value = 0;
    int bit = 0;
    for (char c : gray.toCharArray()) {
        bit ^= c - '0';
        value = value << 1 | bit;
    }
    return value;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int k = Integer.parseInt(IO.readln().trim());
    String[] readings = IO.readln().trim().split(" ");
    int glitches = 0;
    for (int i = 0; i < k; i++) {
        IO.println(readings[i] + " -> " + position(readings[i]));
        if (i > 0) {
            int changed = 0;
            for (int b = 0; b < n; b++) {
                if (readings[i].charAt(b) != readings[i - 1].charAt(b)) {
                    changed++;
                }
            }
            if (changed > 1) {
                glitches++;
            }
        }
    }
    IO.println("Glitches: " + glitches);
}
