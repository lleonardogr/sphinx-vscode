void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] level = new int[n + 1];
    boolean[] manages = new boolean[n + 1];
    level[1] = 1;
    int levels = 1;
    for (int i = 2; i <= n; i++) {
        int boss = Integer.parseInt(parts[i - 2]);
        level[i] = level[boss] + 1; // the manager's level is already known
        manages[boss] = true;
        levels = Math.max(levels, level[i]);
    }
    int[] perLevel = new int[levels + 1];
    int noReports = 0;
    for (int i = 1; i <= n; i++) {
        perLevel[level[i]]++;
        if (!manages[i]) {
            noReports++;
        }
    }
    int widest = 1;
    for (int l = 2; l <= levels; l++) {
        if (perLevel[l] > perLevel[widest]) {
            widest = l;
        }
    }
    IO.println("levels: " + levels);
    IO.println("widest level: " + widest);
    IO.println("widest level size: " + perLevel[widest]);
    IO.println("no reports: " + noReports);
}
