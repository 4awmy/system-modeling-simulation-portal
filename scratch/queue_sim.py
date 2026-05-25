import math

def simulate_queue(arrival_rate, service_rate):
    # Rates per hour
    # We will simulate and output step-by-step
    # We want 3 completions.
    
    # Standard pseudo-random number generator (LCG) to be reproducible
    # Let's write a simple LCG: R_{i+1} = (1664525 * R_i + 1013904223) % 2^32
    # Normalizing to [0, 1)
    state = 42
    def get_rn():
        nonlocal state
        state = (1664525 * state + 1013904223) % 4294967296
        return state / 4294967296.0

    def get_exp(rate):
        r = get_rn()
        # Avoid log(0)
        while r >= 1.0 or r <= 0.0:
            r = get_rn()
        return -math.log(1.0 - r) / rate

    # Let's trace step-by-step
    clock = 0.0
    num_in_system = 0
    completions = 0
    
    # Generate first arrival
    next_arrival = get_exp(arrival_rate)
    next_departure = float('inf')
    
    # Event list
    # We keep track of customer IDs and their arrival times to calculate stats
    arrival_times = []
    
    print(f"{'Step':<5} | {'Event':<10} | {'Clock (h)':<10} | {'System State':<12} | {'Queue (LQ)':<10} | {'Server (LS)':<11} | {'FEL':<25}")
    print("-" * 90)
    
    step = 0
    # Print initial state
    print(f"{step:<5} | {'Start':<10} | {clock:<10.4f} | {num_in_system:<12d} | {0:<10d} | {0:<11d} | A@{next_arrival:.4f}")
    
    while completions < 3:
        step += 1
        # Decide next event
        if next_arrival < next_departure:
            # Arrival event
            clock = next_arrival
            num_in_system += 1
            arrival_times.append(clock)
            
            # Generate next arrival
            inter_arr = get_exp(arrival_rate)
            next_arrival = clock + inter_arr
            
            # If server was idle, start service
            if num_in_system == 1:
                serv_time = get_exp(service_rate)
                next_departure = clock + serv_time
                
            event_name = "Arrival"
        else:
            # Departure event
            clock = next_departure
            num_in_system -= 1
            completions += 1
            
            # If there are still customers, start next service
            if num_in_system > 0:
                serv_time = get_exp(service_rate)
                next_departure = clock + serv_time
            else:
                next_departure = float('inf')
                
            event_name = "Departure"
            
        lq = max(0, num_in_system - 1)
        ls = 1 if num_in_system > 0 else 0
        fel_str = ""
        if next_arrival != float('inf'):
            fel_str += f"A@{next_arrival:.4f}"
        if next_departure != float('inf'):
            if fel_str: fel_str += ", "
            fel_str += f"D@{next_departure:.4f}"
            
        print(f"{step:<5} | {event_name:<10} | {clock:<10.4f} | {num_in_system:<12d} | {lq:<10d} | {ls:<11d} | {fel_str:<25}")

simulate_queue(2.0, 3.0)
