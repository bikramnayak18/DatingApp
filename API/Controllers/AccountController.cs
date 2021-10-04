using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService){
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if(user == null) return Unauthorized("Invalid Username");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for(int i=0;i<computedHash.Length;i++){
                if(computedHash[i] != user.Password[i])
                    return Unauthorized("Invalid Password");
            }

            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){
            if(await UserExists(registerDto.Username)) return BadRequest("User already exist");
            using var hmac = new HMACSHA512();
            var user = new AppUser{
                UserName = registerDto.Username.ToLower(),
                Password = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username){
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }

    
}