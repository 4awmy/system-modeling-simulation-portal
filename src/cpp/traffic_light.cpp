#include <iostream>
#include <iomanip>
#include <cmath>
#include <cstdlib>

using namespace std;

int main() {
    int trials;
    cout << "Enter number of trials: ";
    if (!(cin >> trials)) return 1;

    // Theoretical probabilities
    double p_green = 0.40;
    double p_yellow = 0.10;
    double p_red = 0.50;

    int green = 0, yellow = 0, red = 0;
    
    // Seed random number generator with a fixed seed for reproducible trace comparison
    srand(42);

    for (int i = 0; i < trials; i++) {
        double r = (double)rand() / RAND_MAX;
        if (r < p_green) {
            green++;
        } else if (r < p_green + p_yellow) {
            yellow++;
        } else {
            red++;
        }
    }

    double sim_green = (double)green / trials;
    double sim_yellow = (double)yellow / trials;
    double sim_red = (double)red / trials;

    // Calculate percentage error for each light
    double err_green = abs(p_green - sim_green) / p_green * 100;
    double err_yellow = abs(p_yellow - sim_yellow) / p_yellow * 100;
    double err_red = abs(p_red - sim_red) / p_red * 100;

    cout << "\nTraffic Light Simulation Results (" << trials << " trials):" << endl;
    cout << "--------------------------------------------------------" << endl;
    cout << setw(8) << "Color" << " | " << setw(11) << "Theoretical" << " | " 
         << setw(8) << "Count" << " | " << setw(11) << "Simulated" << " | " 
         << setw(8) << "Error (%)" << endl;
    cout << "--------------------------------------------------------" << endl;
    cout << setw(8) << "Green" << " | " << setw(11) << p_green << " | " 
         << setw(8) << green << " | " << setw(11) << sim_green << " | " 
         << setw(8) << fixed << setprecision(2) << err_green << "%" << endl;
    cout << setw(8) << "Yellow" << " | " << setw(11) << p_yellow << " | " 
         << setw(8) << yellow << " | " << setw(11) << sim_yellow << " | " 
         << setw(8) << fixed << setprecision(2) << err_yellow << "%" << endl;
    cout << setw(8) << "Red" << " | " << setw(11) << p_red << " | " 
         << setw(8) << red << " | " << setw(11) << sim_red << " | " 
         << setw(8) << fixed << setprecision(2) << err_red << "%" << endl;
    cout << "--------------------------------------------------------" << endl;

    return 0;
}
