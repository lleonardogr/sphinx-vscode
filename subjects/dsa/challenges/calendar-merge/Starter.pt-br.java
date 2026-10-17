void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int[][] meetings = new int[n][2];
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        meetings[i][0] = Integer.parseInt(parts[0]);
        meetings[i][1] = meetings[i][0] + Integer.parseInt(parts[1]); // the end
    }

    // TODO: ordene as reuniões pelo início, junte as que se sobrepõem em blocos e imprima as três linhas
}
