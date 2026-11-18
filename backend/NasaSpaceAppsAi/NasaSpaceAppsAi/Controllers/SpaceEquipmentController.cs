using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NasaSpaceAppsAi.data;
using NasaSpaceAppsAi.Models;

namespace NasaSpaceAppsAi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceEquipmentController : ControllerBase
    {
        private readonly NasaSpaceAppsApiContext _context;

        public SpaceEquipmentController(NasaSpaceAppsApiContext context)
        {
            _context = context;
        }

        // GET: api/SpaceEquipment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpaceEquipment>>> GetSpaceEquipments()
        {
            return await _context.SpaceEquipments.ToListAsync();
        }

        // POST: api/SpaceEquipment
        [HttpPost]
        public async Task<ActionResult<SpaceEquipment>> CreateSpaceEquipment(SpaceEquipment equipment)
        {
            _context.SpaceEquipments.Add(equipment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSpaceEquipments), new { id = equipment.Id }, equipment);
        }
        // GET: api/SpaceEquipment/location/Moon
        [HttpGet("location/{location}")]
        public async Task<ActionResult<IEnumerable<SpaceEquipment>>> GetEquipmentByLocation(string location)
        {
            // Fetches items where the location matches (ignoring uppercase/lowercase differences)
            var equipment = await _context.SpaceEquipments
                .Where(e => e.Location != null && e.Location.ToLower() == location.ToLower())
                .ToListAsync();

            if (!equipment.Any())
            {
                return NotFound($"No equipment found on {location}.");
            }

            return equipment;
        }
        // DELETE: api/SpaceEquipment/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearAllEquipment()
        {
            _context.SpaceEquipments.RemoveRange(_context.SpaceEquipments);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}