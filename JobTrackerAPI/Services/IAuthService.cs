using JobTrackerAPI.DTOs;
using JobTrackerAPI.Models;

namespace JobTrackerAPI.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(UserRegisterDto request);
    Task<AuthResponse> LoginAsync(UserLoginDto request);
}

