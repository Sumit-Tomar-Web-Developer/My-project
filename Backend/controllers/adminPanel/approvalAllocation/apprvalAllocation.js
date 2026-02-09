import { Sequelize } from 'sequelize';
import ApprovalWardAlHistory from '../../../models/models/approvalallocationhistory.js';

export const getApprovalWardHistory = async (req, res) => {
  try {
    const history = await ApprovalWardAlHistory.findAll({
      attributes: [
        'allocation_id',
        'user_type',
        'user_id',
        'user_name',
        'zone',
        'ward',
        'allocation_status',
        'allocated_by'
      ],
      order: [['allocation_id', 'DESC']], 
    });

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertApprovalWard = async (req, res) => {
    try {
      const {
        allocation_id, // for edit/update
        user_type,
        user_id,
        user_name,
        zone,
        ward, // array of wards or comma separated string
        allocation_status
      } = req.body;
  
      // Validation
      if (!user_type || !user_id || !user_name || !zone || !ward || ward.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      }
  
      // Convert ward array to comma-separated string if array
      const wardString = Array.isArray(ward) ? ward.join(',') : ward;
  
      if (allocation_id) {
        // Update existing record
        const updated = await ApprovalWardAlHistory.update(
          {
            user_type,
            user_id,
            user_name,
            zone,
            ward: wardString,
            allocation_status: allocation_status || 'Allocate',
          },
          { where: { allocation_id } }
        );
  
        return res.json({ success: true, message: 'Allocation updated successfully.', data: updated });
      } else {
        // Insert new record
        const created = await ApprovalWardAlHistory.create({
          user_type,
          user_id,
          user_name,
          zone,
          ward: wardString,
          allocation_status: allocation_status || 'Allocate',
          allocated_by: user_id // current logged-in user
        });
  
        return res.json({ success: true, message: 'Allocation added successfully.', data: created });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };