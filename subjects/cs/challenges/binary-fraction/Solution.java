void main() {
    double x = Double.parseDouble(IO.readln().trim());
    if (x == 0) {
        IO.println("0.0");
        return;
    }
    StringBuilder bits = new StringBuilder("0.");
    int count = 0;
    while (x > 0 && count < 12) {
        x *= 2;
        if (x >= 1) {
            bits.append('1');
            x -= 1;
        } else {
            bits.append('0');
        }
        count++;
    }
    if (x > 0) {
        bits.append("...");
    }
    IO.println(bits);
}
