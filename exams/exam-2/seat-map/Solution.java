void main() {
    String[] size = IO.readln().trim().split(" ");
    int rows = Integer.parseInt(size[0]);
    int seats = Integer.parseInt(size[1]);
    int n = Integer.parseInt(IO.readln().trim());
    boolean[][] taken = new boolean[rows][seats];
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        int r = Integer.parseInt(p[1]);
        int s = Integer.parseInt(p[2]);
        if (r < 1 || r > rows || s < 1 || s > seats) {
            IO.println("Invalid seat");
        } else if (taken[r - 1][s - 1]) {
            IO.println("Seat taken");
        } else {
            taken[r - 1][s - 1] = true;
            IO.println("Booked row " + r + " seat " + s);
        }
    }
    for (boolean[] row : taken) {
        StringBuilder line = new StringBuilder();
        for (boolean seat : row) line.append(seat ? 'X' : '.');
        IO.println(line);
    }
}
