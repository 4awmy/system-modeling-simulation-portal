#include <iostream>
#include <iomanip>
#include <cmath>
#include <string>
#include <vector>

using namespace std;

// Standard LCG to ensure identical, reproducible outputs for demonstration
unsigned long long lcg_state = 42;
double get_rn() {
    lcg_state = (1664525 * lcg_state + 1013904223) % 4294967296ULL;
    return (double)lcg_state / 4294967296.0;
}

double get_exp(double rate) {
    double r = get_rn();
    while (r >= 1.0 || r <= 0.0) {
        r = get_rn();
    }
    return -log(1.0 - r) / rate;
}

int main() {
    double X, Y;
    cout << "Enter arrival rate X (customers/hour): ";
    if (!(cin >> X)) return 1;
    cout << "Enter departure rate Y (customers/hour): ";
    if (!(cin >> Y)) return 1;

    double clock = 0.0;
    int num_in_system = 0;
    int completions = 0;

    double next_arrival = get_exp(X);
    double next_departure = 1e9; // representing infinity

    cout << "\nEvent-Driven M/M/1 Queue Simulation Trace Table (Stop after 3 completions)" << endl;
    cout << "-------------------------------------------------------------------------------------------------------" << endl;
    cout << setw(5) << "Step" << " | "
         << setw(10) << "Event" << " | "
         << setw(10) << "Clock (h)" << " | "
         << setw(12) << "Sys State" << " | "
         << setw(10) << "Queue (LQ)" << " | "
         << setw(11) << "Server (LS)" << " | "
         << "Future Event List (FEL)" << endl;
    cout << "-------------------------------------------------------------------------------------------------------" << endl;

    int step = 0;
    
    // Initial state
    cout << setw(5) << step << " | "
         << setw(10) << "Start" << " | "
         << setw(10) << fixed << setprecision(4) << clock << " | "
         << setw(12) << num_in_system << " | "
         << setw(10) << 0 << " | "
         << setw(11) << 0 << " | "
         << "A@" << next_arrival << endl;

    while (completions < 3) {
        step++;
        string event_name;

        if (next_arrival < next_departure) {
            clock = next_arrival;
            num_in_system++;
            double inter_arr = get_exp(X);
            next_arrival = clock + inter_arr;

            if (num_in_system == 1) {
                double serv_time = get_exp(Y);
                next_departure = clock + serv_time;
            }
            event_name = "Arrival";
        } else {
            clock = next_departure;
            num_in_system--;
            completions++;

            if (num_in_system > 0) {
                double serv_time = get_exp(Y);
                next_departure = clock + serv_time;
            } else {
                next_departure = 1e9;
            }
            event_name = "Departure";
        }

        int lq = (num_in_system > 0) ? (num_in_system - 1) : 0;
        int ls = (num_in_system > 0) ? 1 : 0;

        cout << setw(5) << step << " | "
             << setw(10) << event_name << " | "
             << setw(10) << fixed << setprecision(4) << clock << " | "
             << setw(12) << num_in_system << " | "
             << setw(10) << lq << " | "
             << setw(11) << ls << " | ";

        if (next_arrival < 1e8) {
            cout << "A@" << next_arrival;
        }
        if (next_departure < 1e8) {
            if (next_arrival < 1e8) cout << ", ";
            cout << "D@" << next_departure;
        }
        cout << endl;
    }
    cout << "-------------------------------------------------------------------------------------------------------" << endl;
    return 0;
}
