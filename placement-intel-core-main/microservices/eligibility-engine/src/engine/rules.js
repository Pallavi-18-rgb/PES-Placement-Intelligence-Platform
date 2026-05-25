/**
 * Evaluates a student's profile against a job's criteria.
 * 
 * @param {Object} student - { cgpa, branch, active_backlogs }
 * @param {Object} job - { min_cgpa, allowed_branches, allows_backlogs }
 * @returns {Object} { eligible: boolean, reasons: string[] }
 */
const evaluateEligibility = (student, job) => {
  const reasons = [];

  // Check CGPA
  if (student.cgpa < job.min_cgpa) {
    reasons.push(`CGPA requirement not met (Requires: ${job.min_cgpa}, Has: ${student.cgpa})`);
  }

  // Check Backlogs
  if (!job.allows_backlogs && student.active_backlogs > 0) {
    reasons.push(`Active backlogs not allowed (Has: ${student.active_backlogs})`);
  }

  // Check Branch
  if (job.allowed_branches && job.allowed_branches.length > 0) {
    if (!job.allowed_branches.includes(student.branch)) {
      reasons.push(`Branch '${student.branch}' is not eligible for this role.`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
};

module.exports = { evaluateEligibility };
